SQL:
For example: the product never ordered use LEFT JOIN to receive all rows of product. After that, just keep the product (NULL) in the order_items 
→ Not use INNER JOIN because INNER JOIN just help us to get the product already have order
WHERE: filter before GROUP BY
HAVING: filter after GROUP BY
If 2 request update 1 row at the same time —> race condition & lost update. 
Parameterized query prevent SQL Injection


const sql = `
  SELECT *
  FROM users
  WHERE email = '${email}'
`;


' OR '1'='1


=> const result = await pool.query(
  `
    SELECT id, email
    FROM users
    WHERE email = $1
  `,
  [email]
);
