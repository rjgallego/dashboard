import React from "react"
import { Handle, Node, Position } from "react-flow-renderer"
import { showModal } from "../../redux/global/global.actions"
import { useDispatch, useSelector } from "react-redux"
import { selectSelectedFlow } from "../../redux/flows/flows.selectors"
import styled from "@emotion/styled"

export const ChartNodeElement = styled.div`
  min-width: 16rem;
  cursor: move;
  text-align: center;
  font-size: 14px;
  background: #fff;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0.25em;
  transition: 0.2s;
  border: 1px solid rgba(0, 153, 153, 0.3);
`

type NodePortProps = {
  type: "source" | "target"
}

function NodePort({ type }: NodePortProps) {
  const NodePortTop = styled(Handle)`
    margin-top: -0.2rem;
    background-color: white;
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 153, 153, 0.3); //todo use theming
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
      display: block;

      content: "";
      background-color: #099;
      color: white;
      border-radius: 0.25rem;
      width: 0.5rem;
      height: 0.5rem;
    }
  `

  const NodePortBottom = styled(NodePortTop)`
    bottom: -0.45rem;
  `
  switch (type) {
    case "source":
      return <NodePortTop type={type} position={Position.Top} />
    case "target":
      return <NodePortBottom type={type} position={Position.Bottom} />
  }
}

type SidebarProps = {
  label: string | undefined
}
type ChartNodeProps = Node | SidebarProps

export default function ChartNode(props: ChartNodeProps) {
  const flowType = useSelector(selectSelectedFlow).type
  const dispatch = useDispatch()

  function isNode(prop: ChartNodeProps): prop is Node {
    return (prop as Node).id !== undefined
  }

  if (isNode(props)) {
    const node = props
    return (
      <ChartNodeElement
        onDoubleClick={() => {
          flowType === "user-generated" &&
            dispatch(showModal("podEdit", { nodeId: node?.id }))
        }}
      >
        {node.id !== "gateway" && <NodePort type="source" />}
        <div id={`chart-node-${node.data.label}`}>
          <div className="node-header">
            <div className={`p-1`}>
              <p className="m-1">
                <span className="text-bold">
                  {node.data.label || (
                    <span className="text-warning">Empty Pod</span>
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>{" "}
        <NodePort type="target" />
      </ChartNodeElement>
    )
  } else
    return (
      <ChartNodeElement id={`chart-node-${props.label}`}>
        <div className="node-header">
          <div className={`p-1`}>
            <p className="m-1">
              <span className="text-bold">
                {props.label || <span className="text-warning">Empty Pod</span>}
              </span>
            </p>
          </div>
        </div>
      </ChartNodeElement>
    )
}
