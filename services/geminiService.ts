
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

export const getAiClient = () => new GoogleGenAI({ apiKey: API_KEY });

type UsageMetadata = GenerateContentResponse['usageMetadata'];

export async function generateGuidance(contents: string, systemInstruction: string | undefined, model: string, temperature: number, topP: number): Promise<{ text: string, usageMetadata: UsageMetadata }> {
  const ai = getAiClient();
  try {
    const combinedInstruction = `${systemInstruction || ''}\n답변은 반드시 한국어로 작성해야 합니다. 글머리 기호(*, -)와 같은 마크다운 목록 스타일을 사용하지 마세요.`.trim();
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: combinedInstruction,
        temperature: temperature,
        topP: topP,
        topK: 64,
      }
    });

    return { text: response.text, usageMetadata: response.usageMetadata };
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    const errorMessage = (error instanceof Error && 'message' in error) ? (error as any).message : String(error);
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }
    throw new Error("Failed to communicate with the Gemini API.");
  }
}

export async function checkMultipleContradictions(
  texts: string[],
  model: string = 'gemini-2.5-flash',
  temperature: number,
  topP: number
): Promise<{ results: { text: string; isContradiction: boolean; reason: string }[], usageMetadata: UsageMetadata }> {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `다음 각 문장에서 사실적 또는 논리적 모순을 분석하세요. 각 문장에 대해 모순 여부와 이유를 포함하는 JSON 객체의 배열을 반환해주세요. 원래 문장을 'text' 필드에 포함해야 합니다. 문장 목록: ${JSON.stringify(texts)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: '분석된 원본 문장.',
              },
              isContradiction: {
                type: Type.BOOLEAN,
                description: '문장에 사실적 또는 논리적 모순이 포함되어 있는지 여부.',
              },
              reason: {
                type: Type.STRING,
                description: '모순이 발견된 경우 간략한 설명. 그렇지 않으면 빈 문자열.',
              },
            },
            required: ['text', 'isContradiction', 'reason'],
          },
        },
        temperature,
        topP,
      },
    });

    const jsonString = response.text.trim();
    const results = JSON.parse(jsonString);
    // Ensure the result is always an array
    const finalResults = Array.isArray(results) ? results : [];

    // The API might not return results for all inputs, so we map them back
    const resultMap = new Map(finalResults.map(r => [r.text, r]));
    const completeResults = texts.map(text => {
        return resultMap.get(text) || { text, isContradiction: false, reason: "API가 이 항목에 대한 결과를 반환하지 않았습니다." };
    });

    return { results: completeResults, usageMetadata: response.usageMetadata };
  } catch (error) {
    console.error("Error checking for multiple contradictions:", error);
    const errorMessage = (error instanceof Error && 'message' in error) ? (error as any).message : String(error);
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }
    throw new Error("모순 확인 중 API 오류가 발생했습니다.");
  }
}


// New Logical Analysis Service Functions
export async function runLogicExtraction(text: string, model: string = 'gemini-2.5-flash', temperature: number, topP: number): Promise<{ result: { sentence: string; expression: string }[], usageMetadata: UsageMetadata }> {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: `다음 텍스트를 문장 단위로 분석하여 각 문장에 대한 형식 논리 술어 표현식을 생성하세요. 사용자 요청의 1단계(개체 및 관계 식별)와 2단계(술어 논리식 변환)를 결합하여 수행합니다. 각 문장과 그에 해당하는 논리식을 쌍으로 제공해주세요. 텍스트: "${text}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING, description: "원본 문장" },
                expression: { type: Type.STRING, description: "해당 문장의 형식 논리 술어 표현식" },
              },
              required: ['sentence', 'expression'],
            }
          },
          temperature,
          topP,
        },
    });
    return { result: JSON.parse(response.text.trim()), usageMetadata: response.usageMetadata };
  } catch (error) {
    console.error("Error in runLogicExtraction:", error);
    const errorMessage = (error instanceof Error && 'message' in error) ? (error as any).message : String(error);
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }
    throw new Error("논리식 추출 중 API 오류가 발생했습니다.");
  }
}

export async function findContradictionsInList(expressions: string[], model: string = 'gemini-2.5-flash', temperature: number, topP: number): Promise<{ result: { expression_pair: [string, string]; is_contradictory: boolean; reason: string }[], usageMetadata: UsageMetadata }> {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: `다음 논리 표현식 목록이 주어졌습니다. 가능한 모든 쌍을 비교하여 모순 관계(예: P와 ¬P)가 있는지 확인하세요. 사용자 요청의 3단계에 해당합니다. 각 쌍에 대해 모순 여부와 그 이유를 제공해주세요. 표현식: ${JSON.stringify(expressions)}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                expression_pair: {
                  type: Type.ARRAY,
                  description: "비교된 두 논리 표현식",
                  items: { type: Type.STRING }
                },
                is_contradictory: { type: Type.BOOLEAN, description: "두 표현식이 모순 관계인지 여부" },
                reason: { type: Type.STRING, description: "모순인 경우, 그 논리적 이유. 모순이 아니면 빈 문자열." }
              },
              required: ['expression_pair', 'is_contradictory', 'reason'],
            }
          },
          temperature,
          topP,
        },
    });
    return { result: JSON.parse(response.text.trim()), usageMetadata: response.usageMetadata };
  } catch(error) {
      console.error("Error in findContradictionsInList:", error);
      const errorMessage = (error instanceof Error && 'message' in error) ? (error as any).message : String(error);
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
      }
      throw new Error("논리적 모순 목록 확인 중 API 오류가 발생했습니다.");
  }
}

export async function generateKnowledgeGraph(text: string, model: string = 'gemini-2.5-flash', temperature: number, topP: number): Promise<{ result: { nodes: { id: string, label: string }[], edges: { from: string, to: string, label: string }[], summary: string }, usageMetadata: UsageMetadata }> {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: `다음 텍스트를 분석하여 지식 그래프를 생성하세요. 핵심 개체(사람, 장소, 개념 등)를 노드로, 그들 사이의 관계를 엣지로 식별합니다. 또한, 발견된 관계에 대한 간략한 요약을 제공하세요. 텍스트: "${text}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                description: "그래프의 노드(개체)",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "개체의 고유 식별자" },
                    label: { type: Type.STRING, description: "개체의 표시 이름" }
                  },
                  required: ['id', 'label']
                }
              },
              edges: {
                type: Type.ARRAY,
                description: "그래프의 엣지(관계)",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    from: { type: Type.STRING, description: "관계의 시작 노드 ID" },
                    to: { type: Type.STRING, description: "관계의 끝 노드 ID" },
                    label: { type: Type.STRING, description: "관계를 설명하는 레이블" }
                  },
                  required: ['from', 'to', 'label']
                }
              },
              summary: {
                type: Type.STRING,
                description: "추출된 관계에 대한 간결한 자연어 요약"
              }
            },
            required: ['nodes', 'edges', 'summary']
          },
          temperature,
          topP,
        },
    });
    return { result: JSON.parse(response.text.trim()), usageMetadata: response.usageMetadata };
  } catch (error) {
      console.error("Error in generateKnowledgeGraph:", error);
      const errorMessage = (error instanceof Error && 'message' in error) ? (error as any).message : String(error);
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
      }
      throw new Error("지식 그래프 생성 중 API 오류가 발생했습니다.");
  }
}
