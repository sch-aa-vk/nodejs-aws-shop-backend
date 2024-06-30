import { ProductType, StockType } from "../utils/types";

export const DATABASE: ProductType[] = [
  {"id":"1","title":"Curry Powder","description":"Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.","price":178.95},
  {"id":"2","title":"Beer - Camerons Cream Ale","description":"Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.","price":148.24},
  {"id":"3","title":"Rice - Aborio","description":"Morbi porttitor lorem id ligula.","price":94.06},
  {"id":"4","title":"Nori Sea Weed - Gold Label","description":"Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.","price":151.08},
  {"id":"5","title":"Jicama","description":"Suspendisse accumsan tortor quis turpis. Sed ante.","price":23.03},
  {"id":"6","title":"Cheese - Brick With Pepper","description":"Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.","price":18.8},
  {"id":"7","title":"Butter - Salted, Micro","description":"Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.","price":70.27},
  {"id":"8","title":"Beef - Short Loin","description":"Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.","price":101.99},
  {"id":"9","title":"Juice - Tomato, 48 Oz","description":"Donec vitae nisi.","price":22.99},
  {"id":"10","title":"Juice - Lagoon Mango","description":"In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.","price":142.86},
  {"id":"11","title":"Apricots Fresh","description":"Integer ac neque. Duis bibendum.","price":93.3},
  {"id":"12","title":"Juice - Apple, 341 Ml","description":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam.","price":103.22},
  {"id":"13","title":"Island Oasis - Banana Daiquiri","description":"Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend.","price":171.81},
  {"id":"14","title":"Pastry - Baked Cinnamon Stick","description":"Maecenas tincidunt lacus at velit.","price":159.3},
  {"id":"15","title":"Beef - Montreal Smoked Brisket","description":"In congue. Etiam justo.","price":107.19},
  {"id":"16","title":"Ham - Smoked, Bone - In","description":"Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.","price":186.41},
  {"id":"17","title":"Cabbage - Green","description":"Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.","price":41.06},
  {"id":"18","title":"Wine - Semi Dry Riesling Vineland","description":"Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.","price":88.33},
  {"id":"19","title":"Crawfish","description":"Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","price":64.13},
  {"id":"20","title":"Nantucket - Carrot Orange","description":"In sagittis dui vel nisl. Duis ac nibh.","price":133.19}
];

export const STOCKS: StockType[] = [
  {"product_id":"1","count":10},
  {"product_id":"2","count":15},
  {"product_id":"3","count":20},
  {"product_id":"4","count":12},
  {"product_id":"5","count":8},
  {"product_id":"6","count":5},
  {"product_id":"7","count":18},
  {"product_id":"8","count":14},
  {"product_id":"9","count":7},
  {"product_id":"10","count":9},
  {"product_id":"11","count":11},
  {"product_id":"12","count":16},
  {"product_id":"13","count":13},
  {"product_id":"14","count":6},
  {"product_id":"15","count":17},
  {"product_id":"16","count":3},
  {"product_id":"17","count":4},
  {"product_id":"18","count":2},
  {"product_id":"19","count":1},
  {"product_id":"20","count":19}
]