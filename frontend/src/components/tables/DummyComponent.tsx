import type React from 'react'

interface Person {
  name: string
  title: string
  email: string
  role: string
}

interface DummyComponentProps {
  person: Person
}

const DummyComponent: React.FC<DummyComponentProps> = ({ person }) => {
  return (
    <div>
      <h3>{person.name}</h3>
      <p>{person.title}</p>
      <p>{person.email}</p>
      <p>{person.role}</p>
    </div>
  )
}

export default DummyComponent
