import "./Editor.css";
import Editor from '@monaco-editor/react';

function QuickUseEditor({socketId}) {

  const EditorOptions =  {
    minimap: {enabled : false}
  }

  return (
    <>
      <div>
        {console.log(socketId)}
        {socketId ? ( <p>Socket ID: {socketId}</p> ) : ( <p>Connecting to socket...</p> )}
        <div id="editor_container">

        <Editor id="QuickUseEditor" defaultLanguage="javascript" defaultValue='console.log("Welcome")' options={EditorOptions}/>;
        </div>
      </div>
    </>
  );
}

export default QuickUseEditor;
