'use client';

import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, InputAdornment, Button, IconButton, Tooltip
} from '@mui/material';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function AdminDonationsList() {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [loading, setLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchDonations();
  }, [page, rowsPerPage, debouncedSearch, startDate, endDate]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/donations?page=${page}&limit=${rowsPerPage}&search=${encodeURIComponent(debouncedSearch)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const res = await fetch(url);
      const json = await res.json();
      setDonations(json.data || []);
      setTotal(json.total || 0);
    } catch (error) {
      console.error('Error fetching donations', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportExcel = async () => {
    try {
      let url = `/api/admin/donations?page=0&limit=100000&search=${encodeURIComponent(debouncedSearch)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const res = await fetch(url);
      const json = await res.json();
      const allData = json.data || [];
      
      if (allData.length === 0) {
        alert('No data to export');
        return;
      }

      // Generate CSV
      const headers = ['S.No', 'Transaction ID', 'Donor Name', 'Email', 'Phone', 'Amount (INR)', 'Status', 'Date'];
      const csvRows = [headers.join(',')];
      
      allData.forEach((d, i) => {
        const date = new Date(d.created_at).toLocaleString().replace(/,/g, '');
        csvRows.push([
          i + 1,
          d.id,
          `"${(d.donor_name || '').replace(/"/g, '""')}"`,
          d.donor_email || '',
          d.donor_phone || '',
          d.amount,
          d.payment_status,
          date
        ].join(','));
      });
      
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `donations_export_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed', error);
      alert('Export failed');
    }
  };

  const handlePrintPDF = async () => {
    try {
      let url = `/api/admin/donations?page=0&limit=100000&search=${encodeURIComponent(debouncedSearch)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const res = await fetch(url);
      const json = await res.json();
      const allData = json.data || [];
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Donations Report</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
              h2 { text-align: center; }
            </style>
          </head>
          <body>
            <h2>Donations Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Donor Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${allData.map((d, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${d.donor_name}</td>
                    <td>${d.donor_email || '-'}</td>
                    <td>${d.donor_phone || '-'}</td>
                    <td>${d.amount}</td>
                    <td>${d.payment_status}</td>
                    <td>${new Date(d.created_at).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error('Print failed', error);
      alert('Print failed');
    }
  };

  const handlePrintReceipt = (donation) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Donation Receipt - ${donation.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .receipt-box { border: 2px solid #696CFF; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #696CFF; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #696CFF; margin: 0 0 10px 0; }
            .details { line-height: 1.8; font-size: 1.1em; }
            .details strong { width: 150px; display: inline-block; }
            .footer { text-align: center; margin-top: 40px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="header">
              <h1>Donation Receipt</h1>
              <p>Sri Varaha Venkatadri Devasthanam</p>
            </div>
            <div class="details">
              <div><strong>Receipt No:</strong> ${donation.id}</div>
              <div><strong>Date:</strong> ${new Date(donation.created_at).toLocaleString()}</div>
              <div><strong>Donor Name:</strong> ${donation.donor_name}</div>
              <div><strong>Phone:</strong> ${donation.donor_phone || 'N/A'}</div>
              <div><strong>Email:</strong> ${donation.donor_email || 'N/A'}</div>
              <div><strong>Amount:</strong> ₹${donation.amount}</div>
              <div><strong>Status:</strong> ${donation.payment_status}</div>
            </div>
            <div class="footer">
              <p>Thank you for your generous contribution.</p>
              <p>This is a computer generated receipt and requires no signature.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Donations Management</Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
          <Button variant="contained" color="primary" onClick={handleExportExcel} sx={{ minWidth: { xs: '40px', sm: 'auto' }, px: { xs: 1, sm: 2 } }}>
            <DownloadIcon />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 1 }}>Export Excel</Box>
          </Button>
          <Button variant="contained" color="error" onClick={handlePrintPDF} sx={{ minWidth: { xs: '40px', sm: 'auto' }, px: { xs: 1, sm: 2 } }}>
            <PictureAsPdfIcon />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 1 }}>Print PDF</Box>
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 1, sm: 2 }, pb: { xs: '8px !important', sm: '16px !important' } }}>
          {/* Filters Row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: '100%', md: 'auto' }, flexGrow: { md: 1 }, minWidth: { md: 250 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              type={startDate ? 'date' : 'text'}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'auto' }, minWidth: { md: 150 } }}
            />
            <TextField
              size="small"
              type={endDate ? 'date' : 'text'}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'auto' }, minWidth: { md: 150 } }}
            />
            {(search || startDate || endDate) && (
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); }}
                sx={{ width: { xs: '100%', md: 'auto' } }}
              >
                Clear
              </Button>
            )}
          </Box>

          <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>S.No</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Donor Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount (₹)</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} align="center">Loading...</TableCell></TableRow>
                ) : donations.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center">No donations found.</TableCell></TableRow>
                ) : (
                  donations.map((donation, index) => (
                    <TableRow key={donation.id} hover>
                      <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>
                      <TableCell>{donation.donor_name}</TableCell>
                      <TableCell>{donation.donor_email || '-'}</TableCell>
                      <TableCell>{donation.donor_phone || '-'}</TableCell>
                      <TableCell>₹{parseFloat(donation.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Box sx={{
                          bgcolor: donation.payment_status === 'COMPLETED' ? 'success.light' : 'warning.light',
                          color: donation.payment_status === 'COMPLETED' ? 'success.dark' : 'warning.dark',
                          px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold'
                        }}>
                          {donation.payment_status}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(donation.created_at).toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Print Receipt">
                          <IconButton color="primary" onClick={() => handlePrintReceipt(donation)}>
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
