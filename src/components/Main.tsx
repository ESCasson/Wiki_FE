import { useEffect, useState } from "react";
import { iArea, iSectionText } from "../App";
import Info from "./Info";
import Menu from "./Menu";
import postData from "../fetch";

const GETSECTIONTEXTS = `query SectionTextsByArea($area: String!) {
      sectionTextsByArea(area: $area) {
        name
        sectionHTML
      }
    }`


function Main(props:{ areas: iArea[] }) {
  const [text, setText] = useState<iSectionText[]>([])

  useEffect(() => {
    getSectionTexts(props.areas[0]?.name)
  }, [props.areas])

  const getSectionTexts = async (area: string) => {
    if(!area) return
    const query = GETSECTIONTEXTS
    const variable = { "area": area }
    
    return postData(query, variable)
      .then((res) => {
        setText(res.data.sectionTextsByArea)
        console.log('sectionText', res.data.sectionTextsByArea)
      })
      .catch(err => console.log(err));
  }

  const handleChangeArea = (area: string) => getSectionTexts(area)

  return (
    <div className="main">
      <Menu
        areas={props.areas}
        handleChangeArea={handleChangeArea}
      />
      <Info text={text} />
    </div>
  )
}

export default Main;