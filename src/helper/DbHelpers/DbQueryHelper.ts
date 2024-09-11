import { DB_SCHEMA } from "../../config";
import { queryRun } from "../../config/db";
import type { UserTableType } from "../../types/dbTypes";
import Messages from "../textHelpers/messages";

const selectTable = async (
  tableName: string,
  limit: number = 0,
  lastId = 0,
  next = true,
  order = "asc"
) => {
  return await queryRun(
    `SELECT * FROM  ( SELECT * FROM "${DB_SCHEMA}"."${tableName}" 
    where id ${next ? ">" : "<"} ${lastId} order by id 
    ${next ? "asc" : "desc"} ${!!limit ? `limit ${limit}` : ""} )
    Newtable order by id ${order} `
  );
};

const selectByValues = async (
  tableName: string,
  searchData: [string, string][],
  condition = "AND"
) => {
  let sql = `SELECT * FROM "${DB_SCHEMA}"."${tableName}" where `;
  searchData.forEach((e, index) => {
    sql += `${e[0]}='${e[1]}' ${
      !!condition && index < searchData.length - 1 ? `${condition} ` : ""
    }`;
  });
  let checkID = (await queryRun(sql)) as UserTableType[];
  if (!checkID.length) throw new Error(Messages.User_VALIDATE);
  return checkID[0];
};

const addData = async (
  tableName: string,
  body: [string, string][],
  bodyValues: string[]
) => {
  let query = `INSERT INTO "${DB_SCHEMA}"."${tableName}"`;
  let col = "(";
  let val = "(";
  let no = 1;
  for (let e of body) {
    col += `${e[0]}`;
    val += `$${no}`;
    no++;
    if (body.length >= no) {
      col += ", ";
      val += ", ";
    } else {
      col += ")";
      val += ")";
    }
  }
  query += `${col} VALUES ${val}`;
  return await queryRun(query, bodyValues);
};

const updateData = async (
  tableName: string,
  id: number,
  body: [string, string][],
  bodyValues: string[]
) => {
  let query = `Update "${DB_SCHEMA}"."${tableName}" SET `;
  let no = 1;
  for (let e of body) {
    query += `${e[0]}= $${no}`;
    no++;
    if (body.length >= no) query += ", ";
  }
  query += `Where id=${id} returning *;`;
  return await queryRun(query, bodyValues);
};

const deleteData = async (tableName: string, id: number) => {
  return await queryRun(
    `DELETE FROM "${DB_SCHEMA}"."${tableName}" WHERE id = ${id};`
  );
};

export { selectTable, selectByValues, updateData, deleteData, addData };
