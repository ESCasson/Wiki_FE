import React, { useEffect, useState } from 'react';
import './App.css';
import Main from './components/Main';
import postData from './fetch';
import Manager from './components/Manager';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


export interface iSection {
  id: string;
  name: string;
}
export interface iSectionInput {
  id?: string;
  name: string;
}
export interface iArea {
  id: string;
  name: string;
  sections: iSection[],
}

export interface iSectionText {
  id: string;
  name: string;
  area: string;
  sectionHTML: string | null;
  sectionID: string | null;
}


function App() {
  const [areas, setAreas] = useState<iArea[]>([]);

  const getData = async () => {
    const areas: iArea[] = await getAreas()
    setAreas(areas)
  }

  useEffect(() => {
    getData()
  }, [])

  

  const getAreas = async () => {
    return postData(`{getAreas {id name sections {id name }}}`)
      .then((res) => {
        console.log(res.data)
        return res.data.getAreas
      })
      .catch(err => console.log(err));
  }

  const addNewArea = (area: string) => {
    const mutation = `mutation Mutation($sections: [SectionInput], $name: String!) {
      addArea(sections: $sections, name: $name) {
        id
        name
        sections {
          id
          name
        }
      }
    }`
    const variable = {
      "sections": [],
      "name": area
    }
    return postData(mutation, variable)
  }

  const addNewSection = (areaID: string, existingSections: iSection[], newSection: string) => {
    console.log(areaID, existingSections, newSection)
    const mutation = `mutation UpdateAreaSections($updateAreaSectionsId: ID!, $sections: [SectionInput]) {
      updateAreaSections(id: $updateAreaSectionsId, sections: $sections) {
        name
        sections {
          id
          name
        }
      }
    }`

    const updatedSections: iSectionInput[] = [...existingSections, {name: newSection}]
    
    const variable = {
    "updateAreaSectionsId": areaID,
      "sections": updatedSections
  }
   return postData(mutation, variable)
  }


  return (
    <div className="App">
      <header className="App-header">
        Shore Wiki
      </header>
      <div className='main-sections'>

  
          <section className='main' >
          <Router>
            <Routes>
              <Route path="/" Component={() => <Main
                areas={areas}
              />} />
              <Route path="/manage" Component={() => <Manager
                areas={areas}
                addNewArea={addNewArea}
                addNewSection={addNewSection}
                getData={getData}
              />} />
            </Routes>
          </Router>
          </section>
      </div>
      

    </div>
  );
}

export default App;

