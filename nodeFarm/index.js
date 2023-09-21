//MODULES
const fs = require("fs");
const http = require("http");
const url = require("url");

//TEMPLATES AND DATA FILE
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//REPLACE THE PLACEHOLDERS IN THE TEMPELATE FUNCTION
function replaceTemplate(temp, product) {
  let output = temp.replaceAll("{%PRODUCTNAME%}", product.productName);
  output = output.replaceAll("{%PRODUCTDESCRIPTION%}", product.description);
  output = output.replaceAll("{%IMAGE%}", product.image);
  output = output.replaceAll("{%ID%}", product.id);
  output = output.replaceAll("{%FROM%}", product.from);
  output = output.replaceAll("{%PRICE%}", product.price);
  output = output.replaceAll("{%NUTRIENTS%}", product.nutrients);
  output = output.replaceAll("{%QUANTITY%}", product.quantity);
  if (!product.organic) {
    output = output.replaceAll("{%NOTORGANIC%}", "not-organic");
  }

  return output;
}
//CREATING THE SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    const cardOfProducts = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCTCARDS%}", cardOfProducts);
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(output);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>404 Not Found</h1>");
  }
});

server.listen(8000, "127.0.0.1");
