type ApplicantFormPaneProps = {
    page: number
}

export const ApplicantFormPane = ({ page }: ApplicantFormPaneProps) => {
    return (
        <div className="w-full h-full rounded-tr-none rounded-br-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]  from-sky-400 to-blue-500 rounded-xl ">
            <div className="justify-center w-full px-6 font-medium text-left text-white align-middle ">
                {page === 1 && <>
                    <div className="w-full h-full px-1 pt-20 text-2xl uppercase ">
                        <div>General</div>
                        <div>Santos</div>
                        <div>City</div>
                        <div className="mt-5">Water</div>
                        <div>District</div>
                    </div>

                </>}
                {page === 2 && <>
                    <div className="w-full h-full px-1 pt-20 text-2xl uppercase ">
                        <div>General</div>
                        <div>Santos</div>
                        <div>City</div>
                        <div className="mt-5">Water</div>
                        <div>District</div>
                    </div>
                    <div className="pt-24 text-3xl font-bold text-slate-200 ">
                        Start your journey with us.
                    </div>
                </>}
            </div>
        </div>
    );
};
