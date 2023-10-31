import { useEffect, useState } from 'react';
import { iSectionText } from '../App';
import parse from 'html-react-parser'
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css' // Theme



function Info(props: { text: iSectionText[] | null }) {

  const [textSection, setTextSection] = useState<string>("");
  

  useEffect(() => { 
    if (props.text?.length === 0 || props.text === null) return
    setTextSection(prepareText(props.text))
    setTimeout(() => {
      Prism.highlightAll()
    }, 10)
 
  }, [props.text])

  const prepareText = (text: iSectionText[]) => {
    const menuSection = text.map((section) => {
      return `<div><a href=#${section.name}>
      Go to section ${section.name}</a><br/></div>`
    })
    const menuString = menuSection.reduce(
      (accumulator, currentValue) => {
      return accumulator + currentValue
    })
 
    const textSections = text.map((section) => {
      const title = `<h2 id=${section.name}>${section.name}</h2>`
      const footer = `<a href="#top">Go Back To Section Menu</a>`

      return `${title}${section.sectionHTML}${footer}`
    })
    const textString = textSections.reduce(
      (accumulator, currentValue) => {
      return accumulator + currentValue
    })
        
    return `<div className='mb-4'>${menuString}</div>${textString}`
  }
  
  return (
    <div className='p-4'>
     {parse(textSection)}
    </div>
  );
}

export default Info;

