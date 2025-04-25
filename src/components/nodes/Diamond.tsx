import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeType } from '../../types/nodeTypes';

// Component interfaces
export interface DiamondProps {
  label: string;
  position: number;
  onClick: () => void;
  isDarkMode: boolean;
  color: string;
  lightColor: string;
  handleId: string;
  nodeType: NodeType;
}

/**
 * Diamond component for adding child nodes
 * Used in agent nodes to create connections to different node types
 */
const Diamond: React.FC<DiamondProps> = ({ 
  label, 
  position, 
  onClick, 
  isDarkMode, 
  color, 
  lightColor, 
  handleId, 
  nodeType 
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        bottom: '-30px',
        left: `${position}%`,
        transform: 'translateX(-50%) rotate(45deg)',
        width: '24px',
        height: '24px',
        background: isDarkMode ? color : lightColor,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: '2px',
        boxShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
      title={`Add ${label}`}
    >
      <div style={{
        transform: 'rotate(-45deg)',
        fontSize: '10px',
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#2a4365',
        userSelect: 'none',
      }}>
        {label.charAt(0)}
      </div>
      
      {/* Custom handle for this diamond - positioned at the bottom point of the diamond */}
      <Handle
        id={handleId}
        type="source"
        position={Position.Bottom}
        style={{
          background: isDarkMode ? color : lightColor,
          transform: 'translateY(12px) rotate(-45deg)', // Position at the bottom point of the diamond
          bottom: '0',
          left: '50%',
          width: '8px',
          height: '8px',
          zIndex: 20,
        }}
      />
    </div>
  );
};

export default Diamond;
