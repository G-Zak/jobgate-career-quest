import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

const CodeEditor = ({
 language = 'python',
 value = '',
 onChange = () => {},
 theme = 'vs-light',
 options = {}
}) => {
 const editorRef = useRef(null);
 const containerRef = useRef(null);

 useEffect(() => {
 if (containerRef.current) {
 // Create the editor
 editorRef.current = monaco.editor.create(containerRef.current, {
 value: value,
 language: getMonacoLanguage(language),
 theme: theme,
 automaticLayout: true,
 minimap: { enabled: false },
 scrollBeyondLastLine: false,
 fontSize: 14,
 lineNumbers: 'on',
 wordWrap: 'on',
 tabSize: 4,
 insertSpaces: true,
 ...options
 });

 // Listen for content changes
 const disposable = editorRef.current.onDidChangeModelContent(() => {
 const newValue = editorRef.current.getValue();
 onChange(newValue);
 });

 // Cleanup function
 return () => {
 disposable.dispose();
 if (editorRef.current) {
 editorRef.current.dispose();
 }
 };
 }
 }, []);

 // Update editor value when prop changes
 useEffect(() => {
 if (editorRef.current && value !== editorRef.current.getValue()) {
 editorRef.current.setValue(value);
 }
 }, [value]);

 // Update editor language when prop changes
 useEffect(() => {
 if (editorRef.current) {
 const model = editorRef.current.getModel();
 if (model) {
 monaco.editor.setModelLanguage(model, getMonacoLanguage(language));
 }
 }
 }, [language]);

 // Update editor theme when prop changes
 useEffect(() => {
 if (editorRef.current) {
 monaco.editor.setTheme(theme);
 }
 }, [theme]);

 const getMonacoLanguage = (lang) => {
 const languageMap = {
 'python': 'python',
 'javascript': 'javascript',
 'java': 'java',
 'cpp': 'cpp',
 'csharp': 'csharp',
 'go': 'go',
 'rust': 'rust',
 'typescript': 'typescript',
 'html': 'html',
 'css': 'css',
 'json': 'json',
 'sql': 'sql'
 };
 return languageMap[lang] || 'plaintext';
 };

 return (
 <div
 ref={containerRef}
 style={{
 height: '100%',
 width: '100%',
 minHeight: '400px'
 }}
 className="border-0"
 />
 );
};

export default CodeEditor;
