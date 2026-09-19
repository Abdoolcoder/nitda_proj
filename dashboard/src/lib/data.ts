import fs from 'fs';
import path from 'path';

const getSamplesDir = () => path.join(process.cwd(), '..', 'docs', 'samples');

export const readJsonFile = (filename: string) => {
  const filePath = path.join(getSamplesDir(), filename);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
  }
  return [];
};

export const writeJsonFile = (filename: string, data: any) => {
  const filePath = path.join(getSamplesDir(), filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};
