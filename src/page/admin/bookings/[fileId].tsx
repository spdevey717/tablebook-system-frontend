import { useParams } from 'react-router-dom';
import CSVFileBookings from '../../../components/CSVFileBookings';

const FileBookingsPage = () => {
  const { fileId } = useParams<{ fileId: string }>();

  if (!fileId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: File ID not provided</div>
      </div>
    );
  }

  return <CSVFileBookings csvFileId={fileId} />;
};

export default FileBookingsPage;
