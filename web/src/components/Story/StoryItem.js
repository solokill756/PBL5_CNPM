import { Avatar } from '../ui/avatar';
import { defineStyle } from '@chakra-ui/react';

const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
    margin: "7px",
    width: "3.5rem",
    height: "3.5rem"
  })

function StoryItem({ avatar, name, status }) {
    return (
        <Avatar
            // name={name}
            colorPalette="pink"
            src={avatar}
            css={ringCss}
        />
    );
}

export default StoryItem;
