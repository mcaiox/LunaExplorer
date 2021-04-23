import React from 'react';
import "./style.css";
//Table head, labels for each column
function TableHead() {
    return (
        <thead>
            <tr>
                <th scope="col">Picture</th>

                <th scope="col">Name</th>
                <th scope="col">Club</th>
                <th scope="col">Email</th>
                <th scope="col">Skills</th>
            </tr>
        </thead>
    );
};

export default TableHead;

