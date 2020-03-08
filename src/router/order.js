const router = require("express").Router()
const Wish = require("../models/wish")
const Order = require("../models/order")
const { auth } = require("../middleware/auth")
const { getObjectProps } = require("../utils/utils")

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
//status - Pending / on review / ready / Purchased / Completed

router.post("/orders", auth, async (req, res) => {
  try {
    const order = await Order.findOne(
      { user_id: req.user._id, status: "pending" },
      null,
      {
        sort: { createdAt: -1 }
      }
    )

    console.log(req.user)

    //if no pending order create another transaction
    if (!order) {
      const newOrder = new Order({
        ...req.body,
        user_id: req.user._id,
        delivery_address: req.user.delivery_address,
        delivery_name: req.user.delivery_name
      })

      await newOrder.save()
      return res.send({ message: "Order Added successfully" })
    }

    if (order.status === "pending") {
      order.products = order.products.concat(req.body.products)

      //   await order.save()

      return res.send({ message: "Order updated." })
    }
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
})

router.get("/orders", auth, async (req, res) => {
  try {
    const order = await Order.find({ user_id: req.user._id })

    if (!order) {
      return res.status(404).send({ message: "No Orders yet." })
    }
    // console.log(order)

    res.send({ transactions: order })
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
})

router.patch("/orders/:id", async (req, res) => {
  try {
    const order = await Order.isValidID(req.params.id)
    const allowedUpdates = getObjectProps(Order.schema.paths)
    const updates = getObjectProps(req.body)
    const isAllowedUpdate = updates.every(update =>
      allowedUpdates.includes(update)
    )
    const filterInvalidUpdate = updates.filter(
      key => !allowedUpdates.includes(key)
    )

    if (!order) {
      res.status(404).send({ message: "Order not found!" })
    }

    if (!isAllowedUpdate) {
      return res
        .status(400)
        .send({ message: `Invalid field/s: ${filterInvalidUpdate.join(", ")}` })
    }

    updates.forEach(update => {
      order[update] = req.body[update]
    })

    await order.save()

    res.send({ message: "Order Updated.", order })
    
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
})

module.exports = router
