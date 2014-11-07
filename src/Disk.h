/*
 * Disk.h
 *
 *  Created on: Nov 7, 2014
 *      Author: root
 */

#ifndef SRC_DISK_H_
#define SRC_DISK_H_
#include <unordered_map>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
namespace DBTest {

class Disk {
public:
	static Disk* get(std::string);
	bool isValid();
	void readPage(uint64_t);
	void readExtent(uint64_t);
	void writePage(uint64_t);
	void writeExtent(uint64_t);
	void del();


private:
	Disk(std::string);
	virtual ~Disk();
	static std::unordered_map<std::string, Disk*> disks;
	std::string path;
	int fd;
	uint64_t pageSize;
	uint64_t extentSize;
};

} /* namespace DBTest */

#endif /* SRC_DISK_H_ */
