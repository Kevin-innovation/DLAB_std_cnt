import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAllWeeklyStats } from '../../redux/slices/statsSlice';

function Reports() {
  const weeklyStats = useSelector(selectAllWeeklyStats);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        주간 통계
      </Typography>
      <Paper sx={{ p: 2 }}>
        {weeklyStats.length === 0 ? (
          <Typography>아직 통계 데이터가 없습니다.</Typography>
        ) : (
          weeklyStats.map((stat) => (
            <Box key={stat.weekStartDate} sx={{ mb: 2 }}>
              <Typography variant="h6">
                {stat.weekStartDate} 주 통계
              </Typography>
              <Typography>
                총 학생 수: {stat.totalStudents}명
              </Typography>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}

export default Reports; 