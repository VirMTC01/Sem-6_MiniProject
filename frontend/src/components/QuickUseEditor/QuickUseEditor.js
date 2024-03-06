import "./Editor.css";
import Editor from '@monaco-editor/react';

function QuickUseEditor({socketId}) {
  return (
    <>
      <div>
        {console.log(socketId)}
        {socketId ? ( <p>Socket ID: {socketId}</p> ) : ( <p>Connecting to socket...</p> )}
        <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />;
      </div>
    </>
  );
}

export default QuickUseEditor;
