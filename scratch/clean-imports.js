import fs from 'fs';
import path from 'path';

const srcDir = './src';

function walkDir(currentPath) {
  const files = fs.readdirSync(currentPath);
  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      cleanFile(fullPath);
    }
  }
}

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace version strings in import statements: e.g., from "sonner@2.0.3" -> from "sonner"
  const importRegex = /(from\s+['"])([^'"]+)@\d+\.\d+\.\d+(['"])/g;
  const original = content;
  content = content.replace(importRegex, '$1$2$3');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned imports in: ${filePath}`);
  }
}

console.log('Starting cleanup of versioned imports...');
walkDir(srcDir);
console.log('Cleanup finished!');
