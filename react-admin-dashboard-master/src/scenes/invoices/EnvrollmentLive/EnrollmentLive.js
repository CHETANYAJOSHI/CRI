import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    TextField,
    IconButton,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import './Envrollment.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: 'rgb(57, 49, 132)',
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    padding: '12px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    '&:first-child': {
        paddingLeft: '20px',
        borderTopLeftRadius: '5px',
        borderBottomLeftRadius: '5px',
    },
    '&:last-child': {
        paddingRight: '20px',
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
    },
}));

const Invoices = () => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]); // State for headers
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageGroup, setPageGroup] = useState(0); // 0 for pages 1-10, 1 for pages 11-20, etc.
    const [editMode, setEditMode] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [open, setOpen] = useState(false); // State for the edit dialog form
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State for the delete confirmation dialog
    const [loading, setLoading] = useState(false); // State for loading
    const [premium, setPremium] = useState(150000);
    const [life, setLife] = useState(5000);
    const [CD, setCD] = useState(5000);
    const [file, setFile] = useState(null);
    const [fileSelected, setFileSelected] = useState(false); // Track if a file is selected
    const [uploading, setUploading] = useState(false); // Track if file upload is in progress
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setFileSelected(true); // Set fileSelected to true when a file is selected
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }

        try {
            setUploading(true); // Set uploading to true when upload begins

            const formData = new FormData();
            formData.append('file', file);

            // Replace with your backend API endpoint
            const response = await fetch('http://localhost:5000/upload-file', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('File upload response:', responseData);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Only Excel File Allowed.');
        } finally {
            setFile(null); // Reset file state
            setFileSelected(false); // Reset fileSelected state
            setUploading(false); // Reset uploading state
        }
    };

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/data?page=${page}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setData(jsonData.data);
            setHeaders(jsonData.headers); // Set headers from response
            setCurrentPage(jsonData.currentPage);
            setTotalPages(jsonData.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleNextGroup = () => {
        if ((pageGroup + 1) * 10 < totalPages) {
            setPageGroup(pageGroup + 1);
            setCurrentPage(pageGroup * 10 + 1);
        }
    };

    const handlePrevGroup = () => {
        if (pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage(pageGroup * 10 + 1);
        }
    };

    const openDeleteConfirmation = () => {
        setDeleteConfirmationOpen(true);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
    };

    const renderPaginationButtons = () => {
        const startPage = pageGroup * 10 + 1;
        const endPage = Math.min(startPage + 9, totalPages);

        const pageButtons = [];
        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <Button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    variant={currentPage === i ? 'contained' : 'outlined'}
                    color="primary"
                    style={{ margin: '0 5px' }}
                >
                    {i}
                </Button>
            );
        }
        return pageButtons;
    };

    const handleEdit = (rowIndex) => {
        setEditMode(rowIndex);
        setEditedData(data[rowIndex]);
        setOpen(true); // Open the edit dialog form
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/data/${editMode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedData)
            });

            if (response.ok) {
                const updatedData = [...data];
                updatedData[editMode] = editedData;
                setData(updatedData);
                setEditMode(null);
                setEditedData({});
                setOpen(false); // Close the edit dialog form
            } else {
                throw new Error('Failed to update data');
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleDelete = async () => {
        openDeleteConfirmation();
    };

    const onDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:5000/data`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: selectedRows })
            });

            if (response.ok) {
                const updatedData = data.filter((_, index) => !selectedRows.includes(index));
                setData(updatedData);
                setSelectedRows([]);
                closeDeleteConfirmation(); // Close the delete confirmation dialog
            } else {
                throw new Error('Failed to delete data');
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const onDeleteCancel = () => {
        closeDeleteConfirmation(); // Close the delete confirmation dialog
    };

    const handleInputChange = (e, key) => {
        setEditedData({
            ...editedData,
            [key]: e.target.value
        });
    };

    const handleFileDownload = async () => {
        try {
            const response = await fetch('http://localhost:5000/download-file');
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                throw new Error('Failed to download file');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = data.filter((row) =>
        headers.some((header) =>
            row[header].toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <Box
            style={{
                width: '80vw',
                height: '100vh',
                overflowX: 'auto',
                overflowY: 'auto',
                padding: '20px',
                margin:'auto'
            }}
        >

            <Box style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                        <input type="file" onChange={handleFileChange} />
                        <Button
                            onClick={handleFileUpload}
                            variant="contained"
                            color="primary"
                            disabled={!fileSelected || uploading}
                            style={{ marginLeft: '10px' }}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button
                            onClick={handleFileDownload}
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: '10px' }}
                        >
                            Download
                        </Button>
                    </Box>


            {loading ? (
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper} style={{textAlign:'center' }}>
                        <TextField
                            label="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            variant="outlined"
                            style={{marginBottom:'20px' , width:'50vw'}}
                        />

                        
                        <Table>
                            <TableHead>
                            <TableRow>
                                        <StyledTableCell style={{color:'#4cceac'}}>Actions</StyledTableCell>
                                        
                                        {headers.map((header) => (
                                            <StyledTableCell key={header} style={{color:'#4cceac'}}>
                                                {header}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.map((row, index) => (
                                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(index)}>
                                                    <EditIcon color="info" />
                                                </IconButton>
                                                
                                            </TableCell>
                                           
                                            {Object.keys(row).map((key) => (
                                                <TableCell key={key} style={{ padding: '12px', width: '20%' }}>
                                                    {editMode === index ? (
                                                        <TextField
                                                            value={editedData[key] || ''}
                                                            onChange={(e) => handleInputChange(e, key)}
                                                            fullWidth
                                                            margin="dense"
                                                        />
                                                    ) : (
                                                        row[key]
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                        </Table>
                    </TableContainer>
                    <Box style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                        <Button onClick={handlePrevGroup} variant="contained" color="primary" style={{ marginRight: '10px' }}>
                            Prev
                        </Button>
                        {renderPaginationButtons()}
                        <Button onClick={handleNextGroup} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                            Next
                        </Button>
                    </Box>
                    
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>Edit Data</DialogTitle>
                        <DialogContent>
                            {headers.map((header, index) => (
                                <TextField
                                    key={index}
                                    label={header}
                                    value={editedData[header]}
                                    onChange={(e) => handleInputChange(e, header)}
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: '20px' }}
                                />
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={deleteConfirmationOpen}
                        onClose={closeDeleteConfirmation}
                    >
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete the selected data?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onDeleteCancel} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={onDeleteConfirm} color="primary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default Invoices;
