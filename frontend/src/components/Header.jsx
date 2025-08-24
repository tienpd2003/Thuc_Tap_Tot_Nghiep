import { MdHeadsetMic, MdNotifications, MdAccountCircle, MdLogout, MdAssignment, MdHome, MdHistory, MdApproval, MdOutlineNotifications, MdMenu } from "react-icons/md";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Popover } from '@mui/material';

export default function Header({ role = "employee", onMenuClick, user, onLogout }) {

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

	const handleLogout = () => {
		handleClose();
		if (onLogout) {
			onLogout();
		}
	};

	const open = Boolean(anchorEl);

	const userInfo = user || {
		fullName: "John Doe",
		username: "john.doe",
		email: "john.doe@company.com"
	};

	return (
		<header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
			<div className="flex items-center justify-between">
				{/* Left side - Logo and Menu */}
				<div className="flex items-center gap-4">
					<button
						onClick={onMenuClick}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
					>
						<MdMenu className="h-6 w-6 text-gray-600" />
					</button>

					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
							<MdHeadsetMic className="h-6 w-6 text-white" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-semibold text-gray-900">TicketHub</h1>
							<p className="text-xs text-gray-500">Internal Support System</p>
						</div>
					</div>
				</div>

				{/* Right side - Navigation and User Menu */}
				<div className="flex items-center gap-4">
					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-1">
						{getNavItems().map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										isActive
											? "bg-blue-50 text-blue-700"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`
								}
							>
								<item.icon className="h-4 w-4" />
								<span>{item.label}</span>
							</NavLink>
						))}
					</nav>

					{/* Notifications */}
					<button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
						<MdOutlineNotifications className="h-5 w-5 text-gray-600" />
						<span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
							3
						</span>
					</button>

					{/* User Menu */}
					<div className="flex items-center gap-3">
						<div className="hidden sm:block text-right">
							<p className="text-sm font-medium text-gray-900">{userInfo.fullName}</p>
							<p className="text-xs text-gray-500">{userInfo.email}</p>
						</div>

						<button
							onClick={handleClick}
							className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
								<MdAccountCircle className="h-5 w-5 text-white" />
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
							PaperProps={{
								className: "mt-2 shadow-lg border border-gray-200 rounded-lg",
							}}
						>
							<div className="p-4 min-w-[200px]">
								<div className="mb-3 pb-3 border-b border-gray-200">
									<p className="text-sm font-medium text-gray-900">{userInfo.fullName}</p>
									<p className="text-xs text-gray-500">{userInfo.email}</p>
									<p className="text-xs text-gray-400 capitalize">{role}</p>
								</div>
								
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
								>
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
