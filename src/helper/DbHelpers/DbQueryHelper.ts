import type { QueryResultRow } from "pg";
import { queryRun } from "../../config/db";
import Messages from "../textHelpers/messages";

const selectTable = async (
  tableName: string,
  limit: number = 0,
  lastId = 0,
  next = true,
  order = "asc"
): Promise<QueryResultRow[]> => {
  return (await queryRun(
    `SELECT * FROM  ( SELECT * FROM ${tableName} 
    where id ${next ? ">" : "<"} ${lastId} order by id 
    ${next ? "asc" : "desc"} ${!!limit ? `limit ${limit}` : ""} )
    Newtable order by id ${order} `
  )) as QueryResultRow[];
};

const selectByValues = async (
  tableName: string,
  searchData: [string, string][],
  condition = "AND"
): Promise<QueryResultRow> => {
  let sql = `SELECT * FROM ${tableName} where `;
  searchData.forEach((e, index) => {
    sql += `${e[0]}='${e[1]}' ${
      !!condition && index < searchData.length - 1 ? `${condition} ` : ""
    }`;
  });
  let checkID = (await queryRun(sql))[0] as QueryResultRow;
  if (!checkID) throw new Error(Messages.Item_VALIDATE);
  return checkID;
};

const addData = async (
  tableName: string,
  body: [string, string][],
  bodyValues: string[]
): Promise<QueryResultRow> => {
  let query = `INSERT INTO ${tableName}`;
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
  query += `${col} VALUES ${val} returning *`;
  return (await queryRun(query, bodyValues))[0] as QueryResultRow;
};

const updateData = async (
  tableName: string,
  id: number,
  body: [string, string | number][],
  bodyValues: string[]
): Promise<QueryResultRow> => {
  let query = `Update ${tableName} SET `;
  let no = 1;
  for (let e of body) {
    query += `${e[0]}= $${no}`;
    no++;
    if (body.length >= no) query += ", ";
  }
  query += ` Where id=${id} returning *;`;
  return (await queryRun(query, bodyValues))[0] as QueryResultRow;
};

const deleteData = async (
  tableName: string,
  id: number
): Promise<QueryResultRow> => {
  return (
    await queryRun(`DELETE FROM ${tableName} WHERE id = ${id} returning *;`)
  )[0] as QueryResultRow;
};

export { selectTable, selectByValues, updateData, deleteData, addData };
