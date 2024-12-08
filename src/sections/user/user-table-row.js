// Standard imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// MUI imports
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

// MUI icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDispatch } from 'react-redux';
import { useAuthContext } from 'src/auth/hooks';

// Utilities
import getStripe from 'src/utils/get-stripe';

// Components
import Label from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import ReviewForm from 'src/sections/five/review-form';

// Actions
import { updateContractStatus, updateContractStatusToRejected,updateContractStatusToCancelled } from 'src/app/store/slices/contractSlice';
import { createReview } from 'src/app/store/slices/reviewSlice';


export default function UserTableRow({ row, selected }) {
  const {
    contract_id, // Assuming row has id
    student_name,
    teacher_name,
    teacher_profile_picture,
    student_profile_picture,
    teacher_id,
    student_id,
    start_date,
    end_date,
    status,
    email,
    subjects,
    total_price,
  } = row;


  // useEffect to refresh whenever the contractStatus changes (after dispatch)
 // Dependency array ensures that the effect runs on contractStatus change

  const confirm = useBoolean();
  const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { user } = useAuthContext();
  const role = user?.role;
  const dispatch = useDispatch(); // For dispatching the actions

  const handleOpenReviewDialog = () => setReviewDialogOpen(true);
  const handleCloseReviewDialog = () => setReviewDialogOpen(false);
  useEffect(() => {
  

  }, [dispatch]); 
  const handleApprove = () => {
    dispatch(updateContractStatus({ contractId: contract_id, status: 'approved' }));
  };

  const handleReject = () => {
    dispatch(updateContractStatusToRejected({ contractId: contract_id, status: 'rejected' }));
  };
  const handleCancel = () => { 
    dispatch(updateContractStatusToCancelled({ contractId: contract_id, status: 'cancelled' })); 
  };
  

  const contractId = 26;
  const studentId = 5;
  const teacherId = 27;
  const rating = 4;
  const reviewText = "The teacher was very helpful and explained the concepts clearly. Highly recommend!";
  
 
  const handleSubmitReview = (data) => {
    const updatedData = { ...data, student_id, contract_id, teacher_id };
    console.log('Review Submitted:', updatedData);
    dispatch(createReview(updatedData));
    handleCloseReviewDialog();
  };
   // New Payment Gateway Function
   const handlePayNow = async (payContractId, payTotalPrice) => {
    console.log('Handle Pay Now triggered', payContractId, payTotalPrice); // Check if this is logged

    try {
      // Send the total price to the backend to create the checkout session
      const checkoutSession = await fetch('/api/checkout_sess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure you send JSON data
        },
        body: JSON.stringify({
          amount: payTotalPrice, // Send the total price here// Send the contract_id to associate with the payment
        }),
      });
  
      const checkoutSessionJson = await checkoutSession.json();
  
      if (checkoutSessionJson.statusCode === 500) {
        console.error(checkoutSessionJson.message);
        return;
      }
  
      const stripe = await getStripe(); // You should have a method to get Stripe instance
  
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });
  
      if (error) {
        console.warn(error.message);
      } else {
        // After successful payment, update the contract status to "active"
        const response = await fetch(`/api/contracts/${payContractId}/activate`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Pass the authorization token if needed
          },
        });
  
        const responseJson = await response.json();
  
        if (response.ok) {
          console.log('Contract status updated to active:', responseJson);
        } else {
          console.error('Failed to update contract status:', responseJson.message);
        }
      }
    } catch (error) {
      console.error('Error during payment: ', error);
    }
  };
  

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox"> */}
          {/* <Checkbox checked={selected} onClick={onSelectRow} /> */}
        {/* </TableCell> */}
        {console.log('student_name',student_name)}

        <TableCell >
          {role === 'student' && (
            <Avatar alt={teacher_name} src={teacher_profile_picture} sx={{ mr: 2 }} />
          )}
          {role === 'teacher' && (
            <Avatar alt={teacher_name} src={student_profile_picture} sx={{ mr: 2 }} />
          )}
 </TableCell>


 <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
           {role === 'teacher'  && (
          
          <ListItemText
           
            primary={student_name}
          
         
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
        
          />
        )}
          {role === 'student'  && (
          <ListItemText
           
            primary={teacher_name}
         
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
        
          />
        )}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {subjects?.map((subject) => subject.subject_name).join(', ')}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {new Date(start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {new Date(end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </TableCell>

        <TableCell>
  <Label
    variant="soft"
    color={
      (status === 'active' && 'success') ||
      (status === 'pending' && 'warning') ||
      (status === 'accepted' && 'primary') ||
      (status === 'rejected' && 'error') ||
      (status === 'completed' && 'info') ||
      (status === 'cancelled' && 'error') ||
      'default'
    }
  >
    {status}
  </Label>
</TableCell>


        <TableCell
  align="center"
  sx={{
    textAlign: 'center', // Ensure proper text alignment
  }}
>
  {role === 'teacher' && status === 'pending' && (
    <>
      <Button
        variant="text" // Soft variant simulation
        size="small"
        sx={{
          color: "rgb(119, 237, 139)",
          backgroundColor: 'rgba(34, 197, 94, 0.16)', 
          '&:hover': {
            backgroundColor: '#1f2b37',
          },
        }}
        onClick={handleApprove}
      >
        Approve
      </Button>
      <Button
        variant="text"
        size="small"
        sx={{
          color: 'rgb(255, 172, 130)',
          backgroundColor: 'rgba(255, 86, 48, 0.16)', 
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
          },
          ml: 1,
        }}
        onClick={handleReject}
      >
        Reject
      </Button>
    </>
  )}
  {role === 'student' && status === 'active' && (
    <Button
      variant="text"
      color="primary"
      size="small"
      sx={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', '&:hover': { backgroundColor: 'rgba(0, 128, 0, 0.2)' } }}
      onClick={() => {
        confirm.onTrue();
      }}
    >
      Cancel
    </Button>
  )}
  {role === 'student' && status === 'completed' && (
    <Button
      variant="text"
      color="primary"
      size="small"
      sx={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.2)' } }}
      onClick={handleOpenReviewDialog}
    >
      Add a Review
    </Button>
  )}
{role === 'student' && status === 'accepted' && (
          <Button
          variant="text"
          color="primary"
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            '&:hover': { backgroundColor: 'rgba(255, 165, 0, 0.2)' },
          }}
          onClick={() => handlePayNow(contract_id, total_price)}// Calling payment function here
        >
          Pay now - ${total_price} {/* Displaying the total price */}
        </Button>
          )}
        </TableCell>

      </TableRow>

      {/* Review Dialog */}
      {isReviewDialogOpen && (
        <ReviewForm
          open={isReviewDialogOpen}
          onClose={handleCloseReviewDialog}
          onSubmitReview={handleSubmitReview}
          studentId={row.student_profile_picture}
        />
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Cancel"
        content="Are you sure want to cancel this contract?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCancel(); // Call the handleCancel function
              confirm.onFalse(); // Close the dialog
            }}
          >
            Confirm
          </Button>
        }
      />
    </>
  );
}

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
