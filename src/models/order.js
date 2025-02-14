const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"
    },
    chat_id: {
      type: mongoose.Types.ObjectId
    },
    status: {
      type: String,
      required: true,
      default: "pending"
    },
    subtotal: {
      type: mongoose.SchemaTypes.Mixed
    },
    shipping_fee: {
      type: mongoose.SchemaTypes.Mixed
    },
    delivery_address: {
      type: String,
      trim: true
    },
    delivery_name: {
      type: String,
      trim: true
    },
    products: [
      {
        product_id: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Product"
        },
        product_name: {
          type: String,
          required: true
        },
        variation: {
          type: String,
          required: true
        },
        thumbnail: {
          type: String,
          required: true
        },
        price: {
          type: mongoose.SchemaTypes.Mixed
        },
        discount: {
          type: mongoose.SchemaTypes.Mixed
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    message: {
      type: String
    },
    paymentOption: {
      type: String
    }
  },
  {
    timestamps: true //set Schema Model options
  }
)

orderSchema.statics.isValidID = async _id =>
  mongoose.Types.ObjectId.isValid(_id) ? await Order.findById(_id) : ""

const Order = mongoose.model("Order", orderSchema)

module.exports = Order

// user_id
// chat_id
// transaction_id
// total
// net_income
// PRODUCTS = [{}]
// product_id
// price
// discount
// quantity
// status - Pending / on review / ready(approved) / Purchased / Completedn

//add order button or cart
//POST /orders
//add to cart if no orders yet create order for new transaction (status:Pending)
//if order exist and status pending add to existing order (status:Pending)

//Send for review Button or checkout
//PATCH /orders/:id ----- update status on review
//user send for review (status:on review)

//If they choose to add another item to cart create another transaction

//admin
//Items and quantity will verified by administrator for approval
//PATCH /orders/:id ----- update status approved
//if approved send the approved orders to client change status to (status:approved)
//admin send shipping fee

//Place Order button
//then user will place order client will send data with subtotal or Order Total (status:To shipped)
//Enter message
//Choose payment method -- payment option
//Subtotal

//Payment Method ?
