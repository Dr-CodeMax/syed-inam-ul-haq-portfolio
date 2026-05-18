import {
  Link,
} from "react-router-dom";


// =====================================================
// QUICK ACTIONS
// =====================================================

const QuickActions = ({
  actions = [],
}) => {

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-5
      "
    >

      {actions.map(
        (action) => {

          const Icon =
            action.icon;

          return (

            <Link
              key={action.label}
              to={action.to}
              className="
                group

                bg-white
                border

                rounded-2xl

                p-5

                transition-all
                duration-300

                hover:-translate-y-1
                hover:shadow-lg
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-14
                    h-14

                    rounded-2xl

                    bg-primary/10

                    flex
                    items-center
                    justify-center

                    text-primary
                  "
                >

                  <Icon size={24} />

                </div>


                <div>

                  <h3
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >
                    {action.label}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-1
                    "
                  >
                    {action.description}
                  </p>

                </div>

              </div>

            </Link>

          );

        }
      )}

    </div>

  );

};

export default QuickActions;