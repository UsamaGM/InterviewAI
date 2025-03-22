import { Interview } from "../../../utils/types";

interface DetailsProps {
  interview: Interview;
}

function Details({ interview }: DetailsProps) {
  return (
    <div className="flow-root">
      <dl className="-my-3 divide-y divide-gray-200 text-sm">
        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Title</dt>

          <dd className="text-gray-700 sm:col-span-2">{interview.title}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Recruiter</dt>

          <dd className="text-gray-700 sm:col-span-2">
            {interview.recruiter.name}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Occupation</dt>

          <dd className="text-gray-700 sm:col-span-2">Guitarist</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Salary</dt>

          <dd className="text-gray-700 sm:col-span-2">$1,000,000+</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Bio</dt>

          <dd className="text-gray-700 sm:col-span-2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et facilis
            debitis explicabo doloremque impedit nesciunt dolorem facere, dolor
            quasi veritatis quia fugit aperiam aspernatur neque molestiae labore
            aliquam soluta architecto?
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default Details;
