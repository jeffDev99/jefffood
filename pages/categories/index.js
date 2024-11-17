import CategoriesPage from "@/components/templates/CategoriesPage";

export default function Categories({data}) {
    console.log(data)
  return <CategoriesPage data={data} />;
}

export async function getServerSideProps(context) {
  const {
    query: { difficulty, time },
  } = context;
  const res = await fetch(`${process.env.BASE_URL}/data`);
  const data = await res.json();

  const filteredData = data.filter((item) => {
    const difficultyRes = item.details.filter((detail) => detail.Difficulty && detail.Difficulty === difficulty);

    const timeRes =  item.details.filter((detail) => {
      const cookingTime = detail["Cooking Time"] || "";
      const timeDetail = cookingTime.split(" ")[0];
      if (time === "less" && timeDetail && +timeDetail <= 30) {
        return detail;
      } else if (time === "more" && +timeDetail > 30) {
        return detail;
      }
    });
    if (time && difficulty && timeRes.length && difficultyRes.length) {
      return item;
    } else if (!time && difficulty && difficultyRes.length) {
      return item;
    } else if (time && !difficulty && timeRes.length) {
      return item;
    }
  });
  return {
    props: { data: filteredData },
  };
}