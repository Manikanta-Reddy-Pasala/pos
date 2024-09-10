import { IconButton, Menu, MenuItem, Icon } from '@material-ui/core';
import React from 'react'
import Forward from '../icons/Forward';

export default function Sharemenu(props)
{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = React.useState('');
    const handleClick = (event) =>
    {
        setAnchorEl(event.currentTarget);
    };

    const handlemenuselect = (event) =>
    {
        setAnchorEl(null);
        //    props.handlemenuitem()
    }
    return (
        <div>
            <Forward fontSize='inherit' onClick={handleClick} />
            <Menu id='moremenu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)}>
                {props.menu.map((item, index) =>
                {
                    return (<MenuItem key={index} onClick={handlemenuselect}>
                        <IconButton />{item.name}</MenuItem>)
                })}
            </Menu>
        </div>
    )
}
