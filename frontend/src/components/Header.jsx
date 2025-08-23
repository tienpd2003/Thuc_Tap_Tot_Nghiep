import { MdHeadsetMic, MdNotifications, MdAccountCircle, MdLogout, MdAssignment, MdHome, MdHistory, MdApproval, MdOutlineNotifications, MdMenu } from "react-icons/md";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Popover } from '@mui/material';

export default function Header({ role = "employee", onMenuClick }) {

	const employeeNavItems = [
		{ icon: MdHome, label: "Dashboard", to: "/employee" },
		{ icon: MdHeadsetMic, label: "Create Ticket", to: "/employee/create-ticket" },
		{ icon: MdAssignment, label: "My Tickets", to: "/employee/my-tickets" },
		{ icon: MdHistory, label: "History", to: "/employee/history" },
	];

	const approverNavItems = [
		{ icon: MdHome, label: "Dashboard", to: "/approver" },
		{ icon: MdApproval, label: "My Approval", to: "/approver/my-approval" },
		{ icon: MdAssignment, label: "Approve Tickets", to: "/approver/approve-tickets" },
		{ icon: MdHistory, label: "History", to: "/approver/history" },
	];

	const getNavItems = () => {
		switch (role) {
			case "employee":
				return employeeNavItems;
			case "approver":
				return approverNavItems;
			default:
				return [];
		}
	};

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	const userInfo = {
		fullName: "John Doe",
		username: "john.doe",
		email: "john.doe@company.com"
	};

	return (
		<header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
			<div className="flex h-16 items-center justify-between px-6">
				{/* Logo and Menu Button */}
				<div className="flex items-center gap-3">
					{/* Menu Button for Admin */}
					{role === "admin" && (
						<button
							onClick={onMenuClick}
							className="p-2 text-gray-600 hover:text-[#5e83ae] hover:bg-gray-100 rounded-lg transition-colors md:hidden"
						>
							<MdMenu className="text-2xl" />
						</button>
					)}
					
					<div className="flex items-center justify-center w-10 h-10 bg-[#5e83ae] rounded-lg">
						<MdHeadsetMic className="h-6 w-6 text-white" />
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-lg text-[#5e83ae]">TicketHub</span>
						<span className="text-xs text-gray-500">Internal Support System</span>
					</div>
				</div>

				{/* Navigation for Employee and Approver */}
				{(role === "employee" || role === "approver") && (
					<nav className="hidden md:flex items-center gap-2">
						{getNavItems().map((item, idx) => (
							<NavLink
								key={idx}
								to={item.to}
								className={({ isActive }) =>
									`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
										? "bg-[#5e83ae] text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100 hover:text-[#5e83ae]"
									}`
								} 
							>
								<item.icon className="text-xl transition-all duration-200 group-hover:text-2xl" />
								<span className="text-sm transition-all duration-200 group-hover:text-base">
									{item.label}
								</span>
							</NavLink>
						))}
					</nav>
				)}

				{/* Right side - User info and actions */}
				<div className="flex items-center gap-4">
					{/* Notifications */}
					<button className="relative p-2 text-gray-600 hover:text-[#5e83ae] hover:bg-gray-100 rounded-lg transition-colors">
						<MdOutlineNotifications className="text-2xl" />
						<span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
							3
						</span>
					</button>

					{/* User Menu */}
					<div>
						<button
							onClick={handleClick}
							className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<MdAccountCircle className="h-8 w-8 text-[#5e83ae]" />
							<div className="hidden md:flex flex-col items-start">
								<span className="text-sm font-medium text-gray-900">{userInfo.fullName}</span>
								<span className="text-xs text-gray-500 capitalize">{role}</span>
							</div>
						</button>

						<Popover
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}

						>
							{/* User Info */}
							<div className="p-3 border-b border-gray-100">
								<p className="text-sm font-medium text-gray-900">{userInfo.username}</p>
								<p className="text-xs text-gray-500">{userInfo.email}</p>
							</div>

							{/* Menu Items */}
							<div className="p-1">
								<button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2">
									<MdAccountCircle className="h-4 w-4" />
									Profile
								</button>
								<button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2">
									<MdNotifications className="h-4 w-4" />
									Notifications
								</button>
							</div>

							{/* Logout */}
							<div className="border-t border-gray-100 p-1">
								<button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2">
									<MdLogout className="h-4 w-4" />
									Sign Out
								</button>
							</div>
						</Popover>
					</div>

				</div>
			</div>
		</header>
	);
}
