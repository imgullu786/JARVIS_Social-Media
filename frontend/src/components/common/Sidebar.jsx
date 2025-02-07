import Logo from "../svgs/Logo";
import { Link } from "react-router-dom";

import { AiFillHome } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";

import { useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Sidebar = () => {
	const queryClient = useQueryClient();

	const {mutate: logout} = useMutation({
		mutationFn: async() => {
			try {
				const response = await fetch('/api/auth/logout', {
					method: 'POST',
				});
				const data = await response.json();
				if(!response.ok) throw new Error(data.error || 'Something went wrong');
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success('Logged out successfully');
			queryClient.invalidateQueries({queryKey: ['authUser']});
		},
		onError: () => {
			toast.error("Logout failed");
		}
	});
	const {data:authUser} = useQuery({queryKey: ['authUser']});

	return (
		<div className='hidden md:flex md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<Logo className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<AiFillHome className='w-6 h-6' />
							<span className='text-lg'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to="/explore"
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaSearch className='w-6 h-6' />
							<span className='text-lg'>Explore</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to ='/messages' 
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<AiFillMessage className='w-6 h-6' />
							<span className='text-lg'>Messages</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between items-center flex-1'>
							<div className=''>
								<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullname}</p>
								<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut className='w-5 h-5 cursor-pointer' onClick={(e)=>{
								e.preventDefault();
								logout();
							}} />
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;