# FENIX Visualization box

# Configuration

```javascript
var box = new Box(options);
```

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Default Value</th>
      <th>Example</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>el</td>
      <td>CSS3 Selector/JavaScript DOM element/jQuery DOM element</td>
      <td> - </td>
      <td>"#container"</td>
      <td>component container</td>
    </tr>

    <tr>
      <td>cache</td>
      <td>boolean</td>
      <td>false</td>
      <td>true</td>
      <td>whether or not to use FENIX bridge cache</td>
    </tr>
    
    
    <tr>
      <td>status</td>
      <td>string</td>
      <td>"loading"</td>
      <td>"ready"</td>
      <td>Box status: "ready" "error" "loading" "empty" "huge"</td>
    </tr>
            
    <tr>
      <td>size</td>
      <td>string</td>
      <td>"full"</td>
      <td>"half"</td>
      <td>Box size: "full" "half"</td>
    </tr>
    
     <tr>
          <td>face</td>
          <td>string</td>
          <td>"front"</td>
          <td>"back"</td>
          <td>Box displayed face</td>
        </tr>
    <tr>
        <td>faces</td>
        <td>Array of string</td>
        <td>["front", "back"]</td>
        <td>["front"]</td>
        <td>Box faces to render</td>
      </tr>
      
        <tr>
              <td>menu</td>
              <td>Array of object</td>
              <td>-</td>
              <td>[
                  {
                      label: "Test",
                      url: "",
                      parent_id: "root",
                      id: "test"
  
                  }
              ]</td>
              <td>Top left menu configuration</td>
            </tr>
  
        <tr>
            <td>tabRegistry</td>
            <td>object</td>
            <td>{
                              'blank': {
                                  path: 'fx-v-b/js/tabs/blank'
                              },
                              'table': {
                                  path: 'fx-v-b/js/tabs/table'
                              },
                              'map': {
                                  path: 'fx-v-b/js/tabs/map'
                              },
                              'chart': {
                                  path:'fx-v-b/js/tabs/chart'
                              },
                              'metadata': {
                                  path:'fx-v-b/js/tabs/metadata'
                              },
                              'filter': {
                                  path:'fx-v-b/js/tabs/filter'
                              },
                              'download': {
                                  path:'fx-v-b/js/tabs/download'
                              }
                          },</td>
            <td>-</td>
            <td>Keyset: plugins' ids. Value: object. path: plugin module path</td>
          </tr>
     <tr>
        <td>tabs</td>
        <td>object</td>
        <td>{
                        //'blank': {tabOpts : {}},
                        'table': {tabOpts : {}},
                        'metadata': {tabOpts : {}},
                        'filter': {tabOpts : {}},
                        'map': {tabOpts : {}},
                        'chart': {tabOpts : {type : "line"}},
                        'download': { tabOpts : {}}
                    }</td>
        <td>"half"</td>
        <td>Candidate tabs to be shown. In order to be shown Tab.isSuitable() fn has to return true</td>
      </tr>
  
     <tr>
                <td>toolbarPosition</td>
                <td>string</td>
                <td>"up"</td>
                <td>"down"</td>
                <td>Toolbar start position</td>
              </tr>
              
       <tr>
          <td>toolbarPosition</td>
          <td>string</td>
          <td>"up"</td>
          <td>"down"</td>
          <td>Toolbar start position</td>
        </tr>
        
         </tr>
         <tr>
              <td>d3pQueryParameters</td>
              <td>object</td>
              <td>{
                                language : "EN",
                                dsd : true
                            }</td>
              <td>-</td>
              <td>D3P compatible string parameters</td>
            </tr>
            
        <tr>
          <td>       maxDataSize</td>
          <td>number</td>
          <td>7200</td>
          <td>5000</td>
          <td>Max number of record allowed </td>
        </tr>
        
        <tr>
          <td>hideToolbar</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide tab toolbar</td>
        </tr>
        
         <tr>
          <td>hideMenu</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide top left menu</td>
        </tr>
    
         <tr>
          <td>hideMetadataButton</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide metadata button</td>
        </tr>
        
        <tr>
          <td>hideRemoveButton</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide remove button</td>
        </tr>
        
        <tr>
          <td>hideDownloadButton</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide download button</td>
        </tr>
        
        <tr>
          <td>hideCloneButton</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide clone button</td>
        </tr>
        
        <tr>
          <td>hideFlipButton</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide flip button</td>
        </tr>
        
        <tr>
          <td>hideMinimizeButton</td>
          <td>boolean</td>
          <td>false</td>
          <td>true</td>
          <td>Hide minimize button</td>
        </tr>
        
         <tr>
          <td>title</td>
          <td>string/function</td>
          <td>get i18n metadata title or degrades to uid</td>
          <td>-</td>
          <td>String or function to create the box title</td>
        </tr>

  </tbody>
</table>

# API
