import { createSignal, createResource, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import toast from "solid-toast";
import "../style/loading.css";

const allProducts = () => {
  const [searchInput, setsearchInput] = createSignal("");
  const navigate = useNavigate();
  const [limit, setlimit] = createSignal(8);
  const [skip, setskip] = createSignal(0);
  const [isLoading, setisLoading] = createSignal(false);
  const getProducts = async (search) => {
    if (searchInput()) {
      setisLoading(true);
      return (await fetch(`https://dummyjson.com/products/search?q=${search}`))
        .json()
        .then((res) => {
          setisLoading(false);
          return res;
        });
    } else {
      setisLoading(true);
      return (
        await fetch(
          `https://dummyjson.com/products/search?q=${search}&limit=${limit()}&skip=${skip()}`
        )
      )
        .json()
        .then((res) => {
          setisLoading(false);
          return res;
        });
    }
  };
  const [Products, { mutate, refetch }] = createResource(
    searchInput,
    getProducts
  );
  const totalPages = () => Products()?.total - limit();
  function next() {
    if (skip() > totalPages()) {
      toast.error("No more records");
    } else {
      setskip(skip() + limit());
      refetch();
    }
  }
  function previous() {
    if (skip() <= 0) {
      toast.error("No more records");
    } else {
      setskip(skip() - limit());
      refetch();
    }
  }

  function moveToDetails(id) {
    navigate(`/ProductsDetails/${id}`);
  }

  return (
    <>
      <div
        class="input-group rounded"
        style=" width: 37%;
        padding-left: 100px;"
      >
        <input
          onInput={(e) => setsearchInput(e.currentTarget.value)}
          type="search"
          class="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
        />
      </div>
      {isLoading() == true ? (
        <div class="loader"></div>
      ) : (
        <div class="text-center container py-1">
          <h2 class="my-2 mt-3 mb-1">
            <strong>Products</strong>
          </h2>
          <section class="py-5" style="">
            <div class="container px-4 px-lg-5 mt-1">
              <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                <For each={Products()?.products}>
                  {(Product, i) => (
                    <div
                      class="col mb-5"
                      onClick={() => moveToDetails(Product.id)}
                    >
                      <div
                        class="card h-100"
                        style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"
                      >
                        <div
                          class="badge bg-danger text-white position-absolute"
                          style="top: 0.5rem; right: 0.5rem"
                        >
                          Sale
                        </div>
                        <img
                          class="card-img-top"
                          src={Product.thumbnail}
                          width="96"
                          height="110"
                        />
                        <div class="card-body p-4">
                          <div class="text-center">
                            <h2 class="fw-bolder"></h2>
                            <span class="text-muted text-decoration">
                              {Product?.title} &nbsp;
                            </span>
                            ${Product?.price}
                          </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                          <div class="text-center">
                            <a class="btn btn-outline-dark mt-auto">View</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </section>
          <div style={"display:flex; justify-content:center;"}>
            <ul class="pagination">
              <li class="page-item">
                <a
                  style="cursor: pointer;"
                  class="page-link"
                  onClick={() => previous()}
                >
                  Previous
                </a>
              </li>
              <li class="page-item">
                <a
                  style="cursor: pointer;"
                  class="page-link"
                  onClick={() => next()}
                >
                  Next
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default allProducts;
