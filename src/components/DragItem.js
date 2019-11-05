import React from "react";
import { DragSource } from "react-dnd";
import { DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";

import _ from "lodash";

import { useState } from "react";

const Wrap = props => {
  const originList = [
    { id: 0, name: "djdjd" },
    { id: 1, name: "kkkkkk" },
    { id: 2, name: "很时尚很帅" },
    { id: 3, name: "你啊时候" },
    { id: 4, name: "介绍的" }
  ];
  const [tableList, setTableList] = useState(originList);

  const DropTargetspec = {
    drop(props, monitor, component) {
      const item = monitor.getItem();
      if (!item) return;
      const sourceIndex = item.sourceIndex;
      const targetIndex = props.index;
      if (sourceIndex === targetIndex) return;
      if (sourceIndex < targetIndex) return;
      const cloneList = _.cloneDeep(tableList);
      // const tmpId = cloneList[sourceIndex].id;
      // cloneList[sourceIndex].id = cloneList[props.index].id;
      // cloneList[targetIndex].id = tmpId;
      // const sortTableById = cloneList.sort((pre, next) => pre.id - next.id);
      // setTableList(sortTableById);
      const tempObj = cloneList.splice(sourceIndex, 1);
      cloneList.splice(targetIndex, 0, tempObj[0]);
      console.log(cloneList);
      setTableList(cloneList);
    },
    hover(props, monitor, component) {},
    canDrop(props, monitor) {
      return true;
      // ..
    }
  };
  const DragSourcespecObj = {
    beginDrag(props, monitor, component) {
      return {
        sourceIndex: props.index
      };
      // props 组件当前的 props
      // monitor 是一个 DragSourceMonitor 实例，用来查询当前 drag state 的信息。
      // component 表示当前组件，可以省略。
    },
    endDrag(props, monitor, component) {
      // ..
    },
    canDrag(props, monitor) {
      return true;
      // ..
    },
    isDragging(props, monitor) {
      // ..
    }
  };

  const collectTarget = (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType()
    };
  };

  const collectSource = (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  };

  // console.log();

  const Item = props => {
    const { connectDragSource, connectDropTarget } = props;
    return connectDragSource(
      connectDropTarget(
        <div style={{ cursor: "move", padding: "10px", userSelect: "none" }}>
          {props.id}-{props.name}
        </div>
      )
    );
  };

  const ItemWrap = _.flow(
    DragSource("type", DragSourcespecObj, collectSource),
    DropTarget("type", DropTargetspec, collectTarget)
  )(Item);

  const DragItem = () => {
    return (
      <div>
        <ul>
          {tableList.map((item, index) => (
            <li
              style={{ listStyle: "none", border: "1px solid #eee" }}
              key={item.id}
            >
              <ItemWrap index={index} {...item} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return <DragItem />;
};

export default DragDropContext(HTML5Backend)(Wrap);
// export default DragItem;
