const AlumniItem: React.FC = () => {
  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 px-5 sm:grid-cols-3">
      <div className="order-2 col-span-1 sm:order-1 sm:col-span-2">
        <div className="col-span-2 my-5 h-full w-full">
          <p className="text-center text-xl font-light">동문 정보가 없습니다</p>
        </div>
      </div>
    </div>
  )
}

export default AlumniItem
