<?php

include 'db_conn.php';

function STMT($conn, string $stmt, array $a_param_type, array $a_bind_params): array {
    $a_params = array();
    $param_type = '';
    $n = count($a_param_type);
    for($i = 0; $i < $n; $i++) {
        $param_type .= $a_param_type[$i];
    }

    $a_params[] = &$param_type;
    for($i = 0; $i < $n; $i++) {
        $a_params[] = &$a_bind_params[$i];
    }

    $stmt = $conn->prepare($stmt);
    if ($stmt === false) {
        return array('result'=>false);
    }

    call_user_func_array(array($stmt, 'bind_param'), $a_params);
    $stmt->execute();

    $result = $stmt->get_result();
    $rows = array();
    if ($result !== false) {
        while ($row = $result->fetch_row()) {
            $rows[] = $row;
        }
    }
    $stmt->close();

    if (count($rows) === 0) {
        return array('result'=>true);
    } else {
        return array('result'=>$rows);
    }
}

function sendHome() {
    header('Location: index.html');
}