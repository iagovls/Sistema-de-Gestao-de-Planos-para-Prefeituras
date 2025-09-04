export default function PopUpConfirmation({ 
    message, 
    onConfirm, 
    onCancel 
}: { 
    message: string; 
    onConfirm: () => void; 
    onCancel: () => void; 
}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-6/12">
                <h2 className="text-lg font-semibold mb-4 text-justify">{message}</h2>
                <div className="flex justify-end space-x-4">
                    <button 
                        type="button"
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                        onClick={onConfirm}
                    >
                        Confirmar
                    </button>
                    <button 
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}