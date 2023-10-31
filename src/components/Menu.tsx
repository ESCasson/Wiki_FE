import React, { useEffect, useState } from 'react';
import { iArea } from '../App';
import type { MenuProps } from 'antd';
import { Button, Menu as MenuCom } from 'antd';
import { useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

function Menu(props: {
  areas: iArea[],
  handleChangeArea: (area: string) => void
}) {

  let areas = props.areas
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const getMenuItems = (areas: iArea[]) => {
      return areas.map((area, index) => {
        return getItem(area.name, index)
      })
    }
    setMenuItems(getMenuItems(areas))
  }, [areas])

  const navigate = useNavigate()

  const buttonHandler = (area: string) => {
   props.handleChangeArea(area)
  };

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon ?: React.ReactNode,
    children ?: MenuItem[],
    type ?: 'group',
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const onClick = (event: any) => {
    const area = areas[event.key]
    buttonHandler(area.name)
  }

  const goToManageData = () => {
    return navigate('/manage');
  }


  return (
    <nav className="Menu">
      <MenuCom
        onClick={onClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['0']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={menuItems}
      />
      <Button
        type="primary"
        onClick={() => goToManageData()}
      >Manage Text</Button>
    </nav>
  );
}

export default Menu;
