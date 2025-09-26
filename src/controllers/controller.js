class Controller {
  successResponse(res, data, meta = null) {
    let response = {
      success: true,
      message: "Success",
      data: data,
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(200).json(response);
  }

  successFullyCreatedResponse(res, message) {
    return res.status(201).json({
      success: true,
      message: message ?? "Successfully created",
    });
  }

  errorResponse(res, message) {
    return res.status(500).json({
      success: false,
      message: message || "Oops, something went wrong",
    });
  }

  notFoundResponse(res, message) {
    return res.status(404).json({
      success: false,
      message: message || "Not found",
    });
  }
}

export default Controller;