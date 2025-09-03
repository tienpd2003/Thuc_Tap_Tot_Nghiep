import React from "react";
import { useNavigate } from "react-router-dom";
import FormTemplateList from "../../../features/form-templates/FormTemplateList";
import { MdOutlineNoteAdd } from "react-icons/md";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ROUTES } from "../../../constants";

export default function FormTemplateManagement() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">

<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quản lý form mẫu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Danh sách và quản lý các phòng ban trong tổ chức
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(ROUTES.ADMIN.FORM_TEMPLATES.CREATE)}
          size="large"
        >
          Thêm form mẫu
        </Button>
      </Box>
      
      {/* <div className="flex items-center justify-between">
        <h1 className="text-[34px] font-bold text-gray-800">Quản lý form mẫu</h1>
        <button
          onClick={() => navigate("/admin/form-templates/create")}
          className="cursor-pointer flex justify-center items-center gap-2 outline-none font-medium transition-all duration-200 text-[#1976d2] hover:text-[#4a6b8a]"
        >
          <MdOutlineNoteAdd /> 
          New Form Template
        </button>
      </div> */}

      <FormTemplateList />
    </div>
  );
}


