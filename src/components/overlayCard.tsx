interface OverlayCardProps {
    children: React.ReactNode; // Define que BoxContainer recibirá children
}

export const OverlayCard: React.FC<OverlayCardProps>  = ({children}) => {
  return (
    <div className="relative z-[100]">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white border border-orange-500 p-8 rounded-lg shadow-md max-w-3xl min-w-[100px]">
          {children}
        </div>
      </div>
    </div>
  );
};