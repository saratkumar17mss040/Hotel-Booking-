type PriceFilterPropType = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

export default function PriceFilter({
  selectedPrice,
  onChange,
}: PriceFilterPropType) {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        className="p-2 border rounded-md w-full"
        value={selectedPrice}
        // this onChange is set undefined like this, so that the user can select
        // default value - select max price - for that, we will set undefined
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        <option value="">Select Max Price</option>
        {[50, 100, 200, 300, 500].map((price) => {
          return <option value={price}>{price}</option>;
        })}
      </select>
    </div>
  );
}
