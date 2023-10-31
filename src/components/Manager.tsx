import { useEffect, useRef, useState } from 'react';
import postData from '../fetch'
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import { iArea, iSection, iSectionText } from '../App';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import InputModal from './inputModal';
import { useNavigate } from 'react-router-dom';

const GET_SECTION_TEXT_BY_SECTION_ID = `
  query SectionTextsBySectionId($sectionId: String!) {
    sectionTextsBySectionId(sectionID: $sectionId) {
      id
      name
      sectionHTML
      area
      sectionID
      }
    }`
const ADD_SECTION_TEXT = `
      mutation Mutation(
        $name: String!, $area: String!, $sectionHtml: String!, $sectionId: String!) {
        addSectionText(name: $name, area: $area, sectionHTML: $sectionHtml, sectionID: $sectionId) {
          id
          area
          name
          sectionHTML
          sectionID
          }
        }
      `
const EDIT_SECTION_TEXT = `
  mutation UpdateSectionText($Id: ID!, $sectionHtml: String!) {
    updateSectionText(id: $Id, sectionHTML: $sectionHtml) {
      sectionHTML
    }
  }`;

function Manager(props: {
  areas: iArea[],
  addNewArea: (area: string) => Promise<void>
  addNewSection: (areaID: string, existingSections: iSection[], section: string) => Promise<void>
  getData: () =>Promise<void>
}) {
  const apikey = "3waut6r8v61nzw538v2za99e9yn0tb0yjwhemtdl4k2kp979"
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const [areas, setAreas] = useState<MenuProps['items']>([]);
  const [selectedArea, setSelectedArea] = useState<(iArea | null)>(null);
  const [selectedSection, setSelectedSection] = useState<(iSection | null)>(null);
  const [sections, setSections] = useState<MenuProps['items']>([]);
  const [areaDropdownText, setAreaDropdownText] = useState<String>('Select or Add Info Area')
  const [sectionDropdownText, setSectionDropdownText] = useState<String>('Select or Add Section')
  const [isOpen, setIsOpen] = useState(false);
  const [addType, setAddType] = useState("");
  const [sectionText, setSectionText] = useState < (iSectionText | null)>(null)
  

  useEffect(() => { setAreas(castItems(props.areas)) }, [props.areas])

  const navigate = useNavigate();

  const onAreaClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '0') {
      openAddAreaModal()
    }
    updateArea(key)
  };

  const updateArea = (key: string) => {
    if (areas === undefined) return

    const selectedArea = props.areas[Number(key) - 1]
    
    setSelectedArea(selectedArea)
    addContent('')

    if (!selectedArea) return

    setAreaDropdownText(selectedArea.name)
    setSections(castItems(selectedArea.sections))
    setSectionDropdownText('Select Section')

    setSectionText(null)
  }

  const onSectionClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '0') return openAddSectionModal()
    updateSection(key)
  }

  const getSectionTextBySectionId = (sectionId: string) => {
    const query = GET_SECTION_TEXT_BY_SECTION_ID
    const variable = {
      "sectionId": sectionId
    }
    return postData(query, variable)
      .then((res) => {
        console.log('res', res)
        return res.data.sectionTextsBySectionId
      })
      .catch(err => console.log(err));
  }

  const updateSection = async (key: string) => {
    if (sections === undefined || !selectedArea) return

    const selectedSection = (selectedArea.sections[Number(key) - 1])
    setSectionDropdownText(selectedSection.name)
    setSelectedSection(selectedSection)
    const text: iSectionText[] =
      await getSectionTextBySectionId(selectedSection.id)
    
    if (text[0] && text[0].sectionHTML) {
      setSectionText(text[0])
      addContent(text[0].sectionHTML)
      return
    }

    const initialSection: iSectionText = {
      id: selectedSection.id,
      name: selectedSection.name,
      area: selectedArea.name,
      sectionHTML: null,
      sectionID: null
    }
    setSectionText(initialSection)
  }

  const castItems = (itemsArray: any[]) => {
    const menuItems: MenuProps['items'] = itemsArray.map((item, index) => {
      return {
        key: index+1,
        label: item.name,
      }
    })
    return [...menuItems, ...[{ key: 0, label: 'Add Item' }]]
  }

  const addSectionText = (text: string) => {
    if (!sectionText || !editorRef) return
    const query = ADD_SECTION_TEXT
    const variables = {
      "name": selectedSection?.name,
      "area": selectedArea?.name,
      "sectionHtml": text,
      "sectionId": selectedSection?.id
    }
    postData(query, variables).then((res) => {
      console.log(res.data)
    })
      .catch(err => console.log(err));
  }

  const editSectionText = (text: string) => {
    if (!selectedSection) return
    const query = EDIT_SECTION_TEXT
    const variables = {
      "sectionHtml": text,
      "Id": sectionText?.id
    }
    postData(query, variables).then((res) => {
      console.log(res.data)
    })
      .catch(err => console.log(err));
  }


  const openAddAreaModal = () => {
    setAddType('Area')
    setIsOpen(true)
  }

  const openAddSectionModal = () => {
    setAddType('Section')
    setIsOpen(true)
  }

  const addContent = (content: string) => {
    editorRef.current?.setContent(content)
  }
  
  const handleSectionTextSubmit = () => {
    if (!editorRef.current) return // checking we have a editor
    if (sectionText?.sectionID) { // seeing if we have an id
      editSectionText(editorRef.current.getContent()) //edit if we have an id
      return
    }
      addSectionText(editorRef.current.getContent()) //add if we dont
    
  };

  const sectionDropdowns = () => {
    if (!sections || sections.length < 1) return
    return <Dropdown menu={{ items: sections, onClick: onSectionClick }}>
      <Space>
        {sectionDropdownText}
        <DownOutlined />
      </Space>
    </Dropdown>
  }

  const editor = () => {
    if (!sectionText) return
    return <div>
        <Editor
        onInit={(evt, editor) => {
          editorRef.current = editor
        }}
          apiKey={apikey}
        initialValue={sectionText?.sectionHTML || "<p>Add information for this section.</p>"}
          init={{
            height: 500,
            menubar: false,
            plugins:'codesample code',
            toolbar: 'codesample code | undo redo | formatselect' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify ' +
              'removeformat | help',
            codesample_languages: [
              { text: 'HTML/XML', value: 'markup' },
              { text: 'JavaScript', value: 'javascript' },
              { text: 'CSS', value: 'css' },
              { text: 'PHP', value: 'php' },
              { text: 'Ruby', value: 'ruby' },
              { text: 'Python', value: 'python' },
              { text: 'Java', value: 'java' },
              { text: 'C', value: 'c' },
              { text: 'C#', value: 'csharp' },
              { text: 'C++', value: 'cpp' }
            ],
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
        <Button onClick={handleSectionTextSubmit}>Submit Content</Button>
      </div>
    }

  const goToMainPage = () => {
    return navigate('/');
  }

  return (
    <>
      <div className='main'>
        <div className='menu'>
          <Button
            type="primary"
            onClick={()=>goToMainPage()}>
            Info Page
          </Button>
        </div>
        <div>
          <div className='select_section'>
            <Dropdown
              className='dropDown'
              menu={{ items: areas, onClick: onAreaClick }}>
              <Space>
                {areaDropdownText}
                <DownOutlined />
              </Space>
            </Dropdown>
            {sectionDropdowns()}
          </div>
          {editor()}
        </div>
      </div>
      <InputModal
        type={addType}
        open={isOpen}
        area={selectedArea || null}
        setIsOpen={setIsOpen}
        addNewArea={props.addNewArea}
        addNewSection={props.addNewSection}
        getData={props.getData}
      />
    </>
  )
}

export default Manager