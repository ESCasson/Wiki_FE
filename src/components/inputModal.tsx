import { Input, Modal } from 'antd';
import {  useState } from 'react';
import { iArea, iSection } from '../App';

interface InputModalProps {
  type: string,
  area: iArea | null,
  open: boolean,
  setIsOpen: (status: boolean) => void
  addNewArea: (area: string) => Promise<void>
  addNewSection: (
    areaID: string,
    existingSections: iSection[],
    section: string) => Promise<void>
  getData: () => Promise<void>
}

function InputModal({
  type, open, area,
  setIsOpen, addNewArea, getData, addNewSection }: InputModalProps) {

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState("");

  const handleOk = () => {
    setConfirmLoading(true)

    if (type === 'Area') {
      addNewArea(name)
        .then(() => {
          setConfirmLoading(false)
          setIsOpen(false)
          getData()
        })
        .catch(err => console.log(err));
    }

    if (type === 'Section' && area) {
      addNewSection(area.id, area.sections, name)
        .then(() => {
          setConfirmLoading(false)
          setIsOpen(false)
          getData()
        })
        .catch(err => console.log(err));
    }
    
  };
    
  const handleCancel = () => {
    setName("")
    setIsOpen(false)
  };


  return (
    <>
      <Modal
        title={`Add ${type}`}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
          <p>{`Enter name of new ${type}`}</p>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)} />
      </Modal>
    </>
  )
}

export default InputModal;


