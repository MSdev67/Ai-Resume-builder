import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useResume } from '../context/ResumeContext';

// In frontend/src/components/ResumePreview.js
const ResumePreview = ({ resume }) => {
  const { generatePDF } = useResume();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `,
  });

  const handleDownloadPDF = async () => {
    if (!resume?._id) {
      alert('Please save your resume before generating PDF');
      return;
    }
    try {
      await generatePDF(resume._id);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (!resume) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Resume Preview</Typography>
        <Box>
          <Button
            startIcon={<PictureAsPdfIcon />}
            onClick={handleDownloadPDF}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="contained">
            Print
          </Button>
        </Box>
      </Box>
      
      <Card ref={componentRef} sx={{ p: 3 }}>
        <CardContent>
          {/* Preview content remains the same as your original */}
        </CardContent>
      </Card>
    </Box>
  );
}