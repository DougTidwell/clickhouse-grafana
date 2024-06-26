import React, {useEffect, useState} from 'react';
import {initiateEditor, LANGUAGE_ID, THEME_NAME} from "./editor/initiateEditor";
import {CodeEditor} from "@grafana/ui";
import {useSystemDatabases} from "../../../hooks/useSystemDatabases";
import {useAutocompleteData} from "../../../hooks/useAutocompletionData";

export const SQLCodeEditor = ({
 query, onSqlChange, onRunQuery, datasource 
}: any) => {
  const [initialized, setInitialized] = useState(false)
  const [updatedSQLQuery, setUpdatedSQLQuery] = useState(query.query)
  const autocompletionData = useAutocompleteData(datasource);
  const databasesData = useSystemDatabases(datasource);

  useEffect(() => {
    onSqlChange(updatedSQLQuery)
    // eslint-disable-next-line
  }, [updatedSQLQuery]);

  useEffect(() => {
    if (!autocompletionData || !databasesData || !initialized) {
      return;
    }

    setInitialized(false)

    // @ts-ignore
    initiateEditor(datasource.templateSrv.getVariables().map(item => `${item.name}`), window.monaco, autocompletionData, databasesData)
    setTimeout(() => {
      // @ts-ignore
      window.monaco.editor.setTheme(THEME_NAME)
    }, 20)

  }, [autocompletionData, databasesData, initialized, datasource.templateSrv]);

  const options: any = {
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingStrategy: 'advanced',
    scrollbar: {
      alwaysConsumeMouseWheel: false
    },
    minimap: {
      enabled: false
    },
    overviewRulerLanes: 0
  }

  return (
    <div style={{ position: 'relative', width: '100%', marginTop: '10px'}} >
      <CodeEditor
        height={Math.max(query.query.split('\n').length * 18, 150)}
        value={query.query}
        language={LANGUAGE_ID}
        monacoOptions={options}
        onBeforeEditorMount={() => setInitialized(true)}
        onChange={setUpdatedSQLQuery}
        onBlur={onRunQuery}
      />
    </div>
  );
};
