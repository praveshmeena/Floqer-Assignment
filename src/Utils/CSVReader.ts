import Papa from "papaparse";
import { SalaryData } from "./types";

export const fetchAndReadCSV = async (
  filePath: string
): Promise<SalaryData[]> => {
  const response = await fetch(filePath);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let csvData = "";

  if (reader) {
    const { done, value } = await reader.read();
    csvData = decoder.decode(value);
  }

  const parsedData = Papa.parse<SalaryData>(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  return parsedData.data;
};
