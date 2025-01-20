import {Typography} from "@mui/material";
import React from 'react';

function Dashboard() {
  return (
    <div style={{height:"100vh"}}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 , marginLeft:"15px"}}>
          Dashboard
        </Typography>
       <div className="container mt-4">
          <div className="row g-3 mb-4">
            {[
              { label: "ORDERS", value: "1,587", change: "+11%", style: "success" },
              { label: "REVENUE", value: "$46,782", change: "-29%", style: "danger" },
              { label: "AVERAGE PRICE", value: "$15.9", change: "0%", style: "warning" },
              { label: "PRODUCT SOLD", value: "1,890", change: "+89%", style: "success" },
            ].map((card, idx) => (
              <div className="col-md-3" key={idx}>
                <div className="p-3 bg-white shadow-sm rounded">
                  <h6>{card.label}</h6>
                  <h4>{card.value}</h4>
                  <span className={`text-${card.style}`}>{card.change}</span>
                </div>
              </div>
            ))}
          </div>
          </div>   
          
    </div>
  );
}

export default Dashboard;
