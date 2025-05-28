import { useState } from "react";

export function Tabs({ children, defaultValue, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const triggers = [];
  const contents = [];

  const tabs = children.map((child) => {
    if (child.type === TabsTrigger) {
      triggers.push(
        <child.type
          key={child.props.value}
          {...child.props}
          isActive={child.props.value === activeTab}
          onClick={() => setActiveTab(child.props.value)}
        />
      );
    } else if (child.type === TabsContent) {
      if (child.props.value === activeTab) {
        contents.push(<child.type key={child.props.value} {...child.props} />);
      }
    }
    return null;
  });

  return (
    <div className={className}>
      {triggers}
      {contents}
    </div>
  );
}

export function TabsList({ children, className = "" }) {
  return <div className={`flex gap-2 mb-4 ${className}`}>{children}</div>;
}

export function TabsTrigger({ children, onClick, isActive, className = "", value }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-2xl border ${
        isActive ? "bg-blue-600 text-white" : "bg-white text-blue-600"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children }) {
  return <div>{children}</div>;
}
